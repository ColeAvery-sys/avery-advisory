import React from 'react';
import Seo from '../components/Seo';
import EcosystemFlow from '../components/EcosystemFlow';
import RoadmapTimeline from '../components/RoadmapTimeline';

function Ecosystem() {
  return (
    <>
      <Seo
        title="Ecosystem"
        description="Explore how the AveryTech ecosystem connects accessibility, AI, human augmentation, education, and research."
      />
      <EcosystemFlow />
      <RoadmapTimeline />
    </>
  );
}

export default Ecosystem;
