import styled from '@emotion/styled';

export const AvatarRoot = styled.span<{ $size: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  border-radius: 50%;
  background-color: var(--color-avatar);
  color: #fff;
  font-size: ${(props) => Math.round(props.$size * 0.4)}px;
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;
  user-select: none;
  overflow: hidden;
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
