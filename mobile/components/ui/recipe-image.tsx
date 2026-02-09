import React, { useState } from 'react';
import { Image, ImageStyle } from 'react-native';
// import placeholder from '../../../assets/images/placeholder.png'; // adjust path if needed

type RecipeImageProps = {
  uri?: string;
  style?: ImageStyle;
};

const DEFAULT_PLACEHOLDER = 'https://placehold.co/400x300.png';

export default function RecipeImage({ uri, style }: RecipeImageProps) {
  const [error, setError] = useState(false);

  return (
    <Image
      source={error || !uri ?{ uri: DEFAULT_PLACEHOLDER }: { uri }}
      style={style}
      resizeMode="cover"
      onError={() => setError(true)}
    />
  );
}
