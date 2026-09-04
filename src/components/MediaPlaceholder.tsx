import React from 'react';
import { Image as ImageIcon, Video as VideoIcon, Film, Sparkles } from 'lucide-react';

interface MediaPlaceholderProps {
  type?: 'image' | 'video';
  title: string;
  subtitle?: string;
  recommendedSize?: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'portrait' | 'auto';
  className?: string;
  imageUrl?: string;
  videoUrl?: string;
  badgeText?: string;
}

export const MediaPlaceholder: React.FC<MediaPlaceholderProps> = ({
  type = 'image',
  title,
  subtitle = 'Gereserveerde mediacontainer · Wordt in definitieve fase ingevoegd',
  recommendedSize,
  aspectRatio = 'video',
  className = '',
  imageUrl,
  videoUrl,
  badgeText,
}) => {
  // If a real image is provided in the future, render it directly
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-stone-100 ${className}`}>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  // If a real video is provided in the future, render it directly
  if (videoUrl) {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-stone-900 ${className}`}>
        <video
          src={videoUrl}
          controls
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const aspectClass =
    aspectRatio === 'video'
      ? 'aspect-[16/9]'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'wide'
      ? 'aspect-[21/9]'
      : aspectRatio === 'portrait'
      ? 'aspect-[4/5]'
      : '';

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-stone-200/90 bg-stone-100/80 p-6 flex flex-col items-center justify-center text-center transition-all group ${aspectClass} ${className}`}
    >
      {/* Subtle architectural grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Decorative corner indicators */}
      <div className="absolute top-3 left-3 w-2 h-2 border-t-2 border-l-2 border-stone-300 pointer-events-none" />
      <div className="absolute top-3 right-3 w-2 h-2 border-t-2 border-r-2 border-stone-300 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-2 h-2 border-b-2 border-l-2 border-stone-300 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-2 h-2 border-b-2 border-r-2 border-stone-300 pointer-events-none" />

      {/* Badge */}
      <div className="relative z-10 mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-2xs text-[11px] font-semibold uppercase tracking-wider text-stone-600">
        {type === 'video' ? (
          <Film className="w-3.5 h-3.5 text-amber-900" />
        ) : (
          <ImageIcon className="w-3.5 h-3.5 text-amber-900" />
        )}
        <span>{badgeText || (type === 'video' ? 'Video Placeholder' : 'Foto Placeholder')}</span>
      </div>

      {/* Central Icon */}
      <div className="relative z-10 w-12 h-12 rounded-xl bg-white border border-stone-200/80 shadow-2xs flex items-center justify-center text-stone-500 mb-3 group-hover:scale-105 group-hover:text-amber-900 transition-transform">
        {type === 'video' ? (
          <VideoIcon className="w-6 h-6 text-stone-700" />
        ) : (
          <ImageIcon className="w-6 h-6 text-stone-700" />
        )}
      </div>

      {/* Content description */}
      <div className="relative z-10 max-w-md px-4">
        <h4 className="font-bold text-stone-900 text-sm sm:text-base leading-snug mb-1">
          {title}
        </h4>
        <p className="text-xs text-stone-500 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Recommended dimension tag */}
      {recommendedSize && (
        <div className="relative z-10 mt-3 text-[10px] font-mono text-stone-400 bg-stone-200/60 px-2.5 py-0.5 rounded-md">
          Aanbevolen formaat: {recommendedSize}
        </div>
      )}
    </div>
  );
};
