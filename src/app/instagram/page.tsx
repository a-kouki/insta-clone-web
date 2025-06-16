// app/page.tsx
import ClientApp from './components/index';
import {getCookieServer} from '@/lib/cookiesServer';

export default async function HomePage() {

  const token = (await getCookieServer()) ?? '';

  return <ClientApp token ={token}/>;
}
