import React, { useState } from 'react';
import { ExternalLink, Sparkles, Share2, Check, Play, Film } from 'lucide-react';

interface VideoItem {
  id: string;
  youtubeId: string;
  url: string;
  title: string;
  tag: string;
  description: string;
}

const VIDEOS: VideoItem[] = [
  {
    id: 'video-1',
    youtubeId: 'cwO3Yr42pkQ',
    url: 'https://youtu.be/cwO3Yr42pkQ?si=YJO6CdxGOxhJp6fc',
    title: 'Automated Bottling Line & Facility Tour',
    tag: 'Factory Tour',
    description: 'Experience our high-speed, contactless hygienic beverage filling and automated packaging plant in action.',
  },
  {
    id: 'video-2',
    youtubeId: '2UbGkX5BvU8',
    url: 'https://youtu.be/2UbGkX5BvU8?si=IY-jWEp6whz--0DW',
    title: 'Juci Cool Mango & Orchard Fruit Drinks',
    tag: 'Product Showcase',
    description: 'Crafted with premium fruit pulps sourced from select orchards, sealed fresh for pure taste and natural aroma.',
  },
  {
    id: 'video-3',
    youtubeId: 'y12mF7U3fLI',
    url: 'https://youtu.be/y12mF7U3fLI?si=vau8xEHbqfjO4h_M',
    title: 'Refreshing Drinks & Sweets Lineup',
    tag: 'Brand Showcase',
    description: 'Explore our complete retail and wholesale range of flavored drinks, pouches, and traditional Indian sweets.',
  },
];

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@JUCICOOL-JDM';

const YouTubeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const VideoSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (video: VideoItem) => {
    navigator.clipboard.writeText(video.url);
    setCopiedId(video.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="juci-cool-videos" className="py-12 sm:py-20 bg-gradient-to-b from-[#FFFEF7] via-[#F6FAF1] to-[#FFFEF7] border-t border-b border-[#E6EBDD]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E6EBDD]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider mb-3">
              <YouTubeIcon className="w-4 h-4 text-red-600" />
              <span>Official Video Channel</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#183D2B] font-poppins leading-tight">
              Watch Juci Cool In Action
            </h2>
            <p className="text-sm sm:text-base text-[#68756B] mt-2">
              Step inside our modern automated bottling facility, discover how we bottle real orchard fruits, and experience the fresh taste of Juci Cool.
            </p>
          </div>

          {/* YouTube Channel Quick Open Option */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              id="open-youtube-channel-btn"
              className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#FF0000] hover:bg-[#CC0000] text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-200 active:scale-95"
            >
              <YouTubeIcon className="w-5 h-5 text-white" />
              <span>Open @JUCICOOL-JDM on YouTube</span>
              <ExternalLink className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {VIDEOS.map((video, idx) => (
            <div
              key={video.id}
              className="bg-white rounded-3xl border border-[#E6EBDD] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:border-[#138443]/40"
            >
              {/* Responsive 16:9 Video Player Container */}
              <div className="relative w-full aspect-video bg-black overflow-hidden">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8CC63E]/20 text-[#138443] text-[11px] font-bold">
                      <Film className="w-3 h-3" />
                      {video.tag}
                    </span>
                    <span className="text-[11px] font-semibold text-[#68756B]">
                      Episode {idx + 1}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base sm:text-lg text-[#183D2B] font-poppins group-hover:text-[#138443] transition-colors leading-snug">
                    {video.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#68756B] mt-2 line-clamp-2">
                    {video.description}
                  </p>
                </div>

                {/* Card Action Buttons: Open in YouTube & Share Link */}
                <div className="pt-5 mt-4 border-t border-[#E6EBDD] flex items-center justify-between gap-2">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#CC0000] text-xs font-bold transition-all border border-red-200/60 active:scale-95"
                    title="Watch on official YouTube app or site"
                  >
                    <YouTubeIcon className="w-4 h-4 text-[#FF0000]" />
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => handleCopy(video)}
                    className="p-2.5 rounded-xl border border-[#E6EBDD] hover:bg-[#F4F8F0] text-[#68756B] hover:text-[#183D2B] transition-colors"
                    title="Copy video link"
                    aria-label="Copy video link"
                  >
                    {copiedId === video.id ? (
                      <Check className="w-4 h-4 text-[#138443]" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner with Direct Channel Subscribe Callout */}
        <div className="mt-10 sm:mt-12 bg-gradient-to-r from-[#183D2B] via-[#0d6131] to-[#138443] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4 sm:gap-5 text-center md:text-left flex-col md:flex-row">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0 border border-white/20 shadow-inner">
              <YouTubeIcon className="w-8 h-8 text-[#FF4B4B]" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-[#8CC63E]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Subscribe on YouTube</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black font-poppins mt-0.5">
                Join @JUCICOOL-JDM on YouTube
              </h4>
              <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
                Stay updated with factory production videos, retail distribution insights, seasonal flavor launches, and customer stories.
              </p>
            </div>
          </div>

          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FF0000] hover:bg-[#E60000] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-black/20 hover:scale-105 active:scale-95 transition-all"
          >
            <YouTubeIcon className="w-4 h-4" />
            <span>Visit @JUCICOOL-JDM</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
