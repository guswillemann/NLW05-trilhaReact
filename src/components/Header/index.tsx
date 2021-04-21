import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import styles from './styles.module.scss';

export default function Header() {
  const curretDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR,
  })

  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastr Logo" />
      <p>O melhor para você ouvir, sempre</p>
      <span>{curretDate}</span>
    </header>
  );
}