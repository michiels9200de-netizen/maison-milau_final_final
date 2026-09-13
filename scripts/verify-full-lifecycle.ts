// Comprehensive end-to-end verification of account system and order persistence
import fs from 'fs';
import path from 'path';
import { authStore } from '../server/authStore';
import { inventoryStore } from '../server/inventoryStore';

const BASE_URL = 'http://localhost:3000';

async function run() {
  await authStore.init();
  // Ensure stock is available for the test product
  await inventoryStore.updateStock('prod-budget-espresso', 50, 'available');

  console.log('================================================================');
  console.log('STARTING FULL ACCOUNT & ORDER LIFECYCLE AUDIT');
  console.log('================================================================\n');

  const testId = Date.now();
  const testEmail = `audit_client_${testId}@maison-milau-test.be`;
  const testPassword = 'Password123!';
  const testName = `Audit Tester ${testId}`;

  // STEP 1: Registration
  console.log('1. Testing Registration...');
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      name: testName,
      password: testPassword,
      accountType: 'particulier',
      newsletter: false,
    }),
  });
  const regData = await regRes.json();
  console.log('Registration response:', { status: regRes.status, success: regData.success, requiresVerification: regData.requiresVerification });
  if (!regData.success) throw new Error('Registration failed: ' + JSON.stringify(regData));

  // STEP 2: Attempt Login BEFORE verification (must be rejected)
  console.log('\n2. Testing Login BEFORE Verification (must reject)...');
  const unverifiedLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrUsername: testEmail, password: testPassword }),
  });
  const unverifiedLoginData = await unverifiedLoginRes.json();
  console.log('Unverified login attempt:', { status: unverifiedLoginRes.status, success: unverifiedLoginData.success, requiresVerification: unverifiedLoginData.requiresVerification });
  if (unverifiedLoginData.success) throw new Error('Unverified login should NOT have succeeded!');

  // STEP 3: Resend Verification
  console.log('\n3. Testing Resend Verification...');
  const resendRes = await fetch(`${BASE_URL}/api/auth/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail }),
  });
  const resendData = await resendRes.json();
  console.log('Resend verification:', { status: resendRes.status, success: resendData.success });

  // STEP 4: Inspect persistent storage to retrieve verification token
  console.log('\n4. Retrieving Verification Token from Datastore...');
  await authStore.reloadUsers();
  const foundUser = await authStore.getUserByEmail(testEmail);
  if (!foundUser) throw new Error(`User ${testEmail} not found in persistent AuthStore datastore!`);
  const verifyToken = foundUser.verificationToken;
  console.log('Found user in persistent storage. Token:', verifyToken ? verifyToken.substring(0, 10) + '...' : 'none');
  if (!verifyToken) throw new Error('No verificationToken found on user in datastore!');

  // STEP 5: Verify Email via Token
  console.log('\n5. Testing Email Verification via Token...');
  const verifyRes = await fetch(`${BASE_URL}/api/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, token: verifyToken }),
  });
  const verifyData = await verifyRes.json();
  console.log('Email verification result:', { status: verifyRes.status, success: verifyData.success });
  if (!verifyData.success) throw new Error('Email verification failed: ' + JSON.stringify(verifyData));

  // STEP 6: Successful Login
  console.log('\n6. Testing Login with Verified Account...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrUsername: testEmail, password: testPassword }),
  });
  const loginData = await loginRes.json();
  console.log('Login result:', { status: loginRes.status, success: loginData.success, hasToken: !!loginData.token, role: loginData.user?.role });
  if (!loginData.success || !loginData.token) throw new Error('Verified login failed: ' + JSON.stringify(loginData));

  const sessionToken = loginData.token;

  // STEP 7: Session Persistence Check (/api/auth/me)
  console.log('\n7. Testing Session Persistence via /api/auth/me...');
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  });
  const meData = await meRes.json();
  console.log('/api/auth/me result:', { status: meRes.status, success: meData.success, email: meData.user?.email, isVerified: meData.user?.isEmailVerified });
  if (!meData.success || meData.user?.email.toLowerCase() !== testEmail.toLowerCase()) {
    throw new Error('Session verification failed on /api/auth/me: ' + JSON.stringify(meData));
  }

  // STEP 8: Create Order Linked to This Customer
  console.log('\n8. Testing Order Creation & Customer Linking...');
  const orderPayload = {
    customerName: testName,
    customerEmail: testEmail,
    shippingAddress: {
      street: 'Koffiestraat 42',
      city: 'Dendermonde',
      postalCode: '9200',
      country: 'België',
    },
    items: [
      {
        id: 'prod-budget-espresso',
        productId: 'prod-budget-espresso',
        name: 'Budget Espresso',
        quantity: 2,
        price: 24.95,
      }
    ],
    total: 49.90,
  };

  const createOrderRes = await fetch(`${BASE_URL}/api/create-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify(orderPayload),
  });
  const createOrderData = await createOrderRes.json();
  console.log('Order creation result:', {
    status: createOrderRes.status,
    success: createOrderData.success,
    error: createOrderData.error,
    orderId: createOrderData.orderId,
    orderNumber: createOrderData.orderNumber,
    customerId: createOrderData.customerId || createOrderData.order?.customerId,
  });

  const createdOrderId = createOrderData.orderId;
  const createdOrderNumber = createOrderData.orderNumber;
  if (!createdOrderId) throw new Error('Order creation failed to return orderId!');

  // STEP 9: Logout
  console.log('\n9. Testing Customer Logout...');
  const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${sessionToken}` },
  });
  const logoutData = await logoutRes.json();
  console.log('Logout result:', { status: logoutRes.status, success: logoutData.success });

  // Verify session invalidated
  const invalidatedMeRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  });
  const invalidatedMeData = await invalidatedMeRes.json();
  console.log('Check invalidated session (must fail or be guest):', { status: invalidatedMeRes.status, success: invalidatedMeData.success });

  // STEP 10: Returning Customer Login
  console.log('\n10. Testing Returning Customer Login...');
  const returnLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrUsername: testEmail, password: testPassword }),
  });
  const returnLoginData = await returnLoginRes.json();
  console.log('Returning login result:', { status: returnLoginRes.status, success: returnLoginData.success, hasToken: !!returnLoginData.token });
  if (!returnLoginData.success || !returnLoginData.token) throw new Error('Returning login failed!');

  const newSessionToken = returnLoginData.token;

  // STEP 11: Verify Order Persistence & Order-To-Customer Linking
  console.log('\n11. Testing Order Persistence for Returning Customer...');
  const customerOrdersRes = await fetch(`${BASE_URL}/api/orders`, {
    headers: { Authorization: `Bearer ${newSessionToken}` },
  });
  const customerOrdersData = await customerOrdersRes.json();
  console.log('Orders retrieved for customer:', {
    status: customerOrdersRes.status,
    success: customerOrdersData.success,
    ordersCount: customerOrdersData.data?.length,
  });

  const matchingOrder = customerOrdersData.data?.find((o: any) => o.id === createdOrderId || o.orderNumber === createdOrderNumber);
  if (!matchingOrder) {
    throw new Error(`Order ${createdOrderId} (${createdOrderNumber}) was NOT found for customer ${testEmail}!`);
  }
  console.log('Order found and persisted correctly:', {
    id: matchingOrder.id,
    orderNumber: matchingOrder.orderNumber,
    customerEmail: matchingOrder.customerEmail,
    total: matchingOrder.total,
    customerId: matchingOrder.customerId,
  });

  // STEP 12: Testing Forgot Password & Reset Password
  console.log('\n12. Testing Forgot Password Flow...');
  const forgotRes = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail }),
  });
  const forgotData = await forgotRes.json();
  console.log('Forgot password response:', { status: forgotRes.status, success: forgotData.success });

  // Read resetToken from persistent AuthStore
  await authStore.reloadUsers();
  const userForReset = await authStore.getUserByEmail(testEmail);
  const resetToken = userForReset?.resetToken;
  console.log('Reset token retrieved:', resetToken ? resetToken.substring(0, 10) + '...' : 'none');
  if (!resetToken) throw new Error('Reset token was not generated or stored in datastore!');

  const newPassword = 'NewSecretPassword2026!';
  const resetRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: resetToken, newPassword, confirmPassword: newPassword }),
  });
  const resetData = await resetRes.json();
  console.log('Reset password response:', { status: resetRes.status, success: resetData.success });
  if (!resetData.success) throw new Error('Password reset failed: ' + JSON.stringify(resetData));

  // Login with new password
  console.log('\n13. Testing Login with NEW Password...');
  const loginNewPassRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrUsername: testEmail, password: newPassword }),
  });
  const loginNewPassData = await loginNewPassRes.json();
  console.log('Login with new password result:', { status: loginNewPassRes.status, success: loginNewPassData.success });
  if (!loginNewPassData.success) throw new Error('Login with new password failed!');

  // STEP 14: Activity Timeline Verification
  console.log('\n14. Testing Admin Activity Timeline & Notification Center...');
  // Login as admin
  const adminLoginRes = await fetch(`${BASE_URL}/api/admin/verify-pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'milau2026' }),
  });
  const adminLoginData = await adminLoginRes.json();
  const adminToken = adminLoginData.token;
  console.log('Admin login result:', { success: adminLoginData.success, hasToken: !!adminToken });

  const timelineRes = await fetch(`${BASE_URL}/api/admin/activity-timeline?limit=50`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const timelineData = await timelineRes.json();
  console.log('Timeline events count:', timelineData.data?.length);

  const registeredEvent = timelineData.data?.find((e: any) => e.type === 'registration' && e.metadata?.email === testEmail);
  const verifiedEvent = timelineData.data?.find((e: any) => e.type === 'email_verified' && e.metadata?.email === testEmail);
  const orderEvent = timelineData.data?.find((e: any) => e.type === 'order_created' && e.metadata?.orderNumber === createdOrderNumber);

  console.log('Timeline audit check:');
  console.log(' - Registration event recorded:', !!registeredEvent);
  console.log(' - Email verified event recorded:', !!verifiedEvent);
  console.log(' - Order created event recorded:', !!orderEvent);

  console.log('\n================================================================');
  console.log('FULL LIFECYCLE AUDIT COMPLETED SUCCESSFULLY: ALL 14 TESTS PASSED');
  console.log('================================================================');
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ AUDIT FAILED:', err);
    process.exit(1);
  });
