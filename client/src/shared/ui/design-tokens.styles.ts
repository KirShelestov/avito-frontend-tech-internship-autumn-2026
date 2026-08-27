import styled from '@emotion/styled';

export const Page = styled.div`
  padding: var(--space-8);
  display: grid;
  gap: var(--space-8);
  font-family: var(--font-sans);
  color: var(--color-text);
`;

export const SectionTitle = styled.h2`
  margin-bottom: var(--space-4);
`;

export const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--space-3);
`;

export const ColorCard = styled.div`
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
`;

export const ColorSwatch = styled.div<{ token: string }>`
  height: 56px;
  background: var(${(props) => props.token});
`;

export const TokenCode = styled.code`
  display: block;
  padding: var(--space-2);
  font-size: 12px;
`;

export const Stack = styled.div`
  display: grid;
  gap: var(--space-2);
`;

export const SpaceRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

export const SpaceBar = styled.div<{ token: string }>`
  width: var(${(props) => props.token});
  height: 16px;
  background: var(--color-brand-500);
`;

export const RadiiRow = styled.div`
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
`;

export const RadiiItem = styled.div`
  text-align: center;
`;

export const RadiiBox = styled.div<{ token: string }>`
  width: 72px;
  height: 72px;
  background: var(--color-brand-100);
  border: 1px solid var(--color-brand-500);
  border-radius: var(${(props) => props.token});
`;

export const TextSample = styled.div<{ token: string }>`
  font-size: var(${(props) => props.token});
`;
