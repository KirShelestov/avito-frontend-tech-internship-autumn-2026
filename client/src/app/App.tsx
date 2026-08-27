import { useTranslation } from 'react-i18next';
import { Layout, Subtitle } from './App.styles';

export function App() {
  const { t } = useTranslation();

  return (
    <Layout>
      <h1>{t('app.title')}</h1>
      <Subtitle>{t('app.subtitle')}</Subtitle>
    </Layout>
  );
}
