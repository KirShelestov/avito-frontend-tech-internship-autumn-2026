import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
`;

export const Box = styled.span<{
  $width: string;
  $height: string;
  $radius: string;
  $circle: boolean;
}>`
  display: block;
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  border-radius: ${(props) => (props.$circle ? '50%' : props.$radius)};
  background-color: var(--color-surface-muted);
  animation: ${pulse} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
