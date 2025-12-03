// pages/currencies/index.tsx
import { PageCrudWrapper } from '@/components/PageCrudWrapper';
import { currenciesConfig } from '@/config/crud/currencies';

export default function CurrenciesPage() {
  return (
    <PageCrudWrapper
      config={currenciesConfig}
      title="Currencies"
      url="/currencies"
    />
  );
}