import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Circle = styled.span<{ $size: number; $thickness: number }>`
  display: inline-block;
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  border-radius: 50%;
  border: ${(props) => props.$thickness}px solid currentColor;
  border-top-color: transparent;
  animation: ${spin} 0.7s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1.6s;
  }
`;
