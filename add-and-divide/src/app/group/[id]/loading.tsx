import React from 'react';
import ContentLoader from 'react-content-loader';

export default function GroupLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f0f0f5] dark:bg-[#1a1a2e]">
      <ContentLoader
        speed={2}
        width={400}
        height={160}
        viewBox="0 0 400 160"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="0" rx="5" ry="5" width="400" height="160" />
      </ContentLoader>
    </div>
  );
}
