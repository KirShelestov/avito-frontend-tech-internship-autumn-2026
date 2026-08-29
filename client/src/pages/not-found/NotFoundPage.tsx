import { Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@/shared/lib/useDocumentTitle';
import { Button } from '@/shared/ui';
import { Actions, Code, Text, Title, Wrap } from './NotFoundPage.styles';

export function NotFoundPage() {
  const { t } = useTranslation();
  useDocumentTitle(t('notFound.title'));
  const navigate = useNavigate();

  return (
    <Wrap>
      <Code>404</Code>
      <Title>{t('notFound.title')}</Title>
      <Text>{t('notFound.description')}</Text>
      <Actions>
        <Button leftIcon={<Home size={16} />} onClick={() => void navigate('/rooms')}>
          {t('notFound.back')}
        </Button>
      </Actions>
    </Wrap>
  );
}
