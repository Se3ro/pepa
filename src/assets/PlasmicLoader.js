import React from 'react';
import { PlasmicRootProvider, PlasmicComponent } from '@plasmicapp/loader-react';

const PLASMIC = {
  projectId: 'zTqFpL5kCv7KD9iaFpwwwNL632rn8Jddlb0yehLhmtVs0WzcfRpBsgjQKypm30mCiGa2GPk3GB1MDmEM38ogN', // Správné project ID
};

const PlasmicLoader = () => {
  return (
    <PlasmicRootProvider loader={PLASMIC}>
      <PlasmicComponent component="HomePage" />
    </PlasmicRootProvider>
  );
};

export default PlasmicLoader;
