import Head from 'next/head'
import styles from '../../../styles/Home.module.css'
import Link from 'next/link';

const Endpoint = `https://rickandmortyapi.com/api/episode/`;

export async function getServerSideProps({ query }) {
  const { id } = query;
  const res = await fetch(`${Endpoint}${id}`)
  const data = await res.json();
  return {
    props: {
      data
    }
  }
}

export default function EpisodeShow({ data }) {
  const { name, air_date, episode, characters } = data;
  console.log(data);
  return (
    <div className={styles.container}>
      <Head>
        <title>Sometimes Science Is More Art Than Science, Morty</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
      <h1> { name } </h1>
        <div className={styles.character_details}>
          <ul>
            <li>
              <strong>Episode:</strong> { episode }
            </li>
            <li>
              <strong>First time aired:</strong> { air_date }
            </li>
          </ul>
        </div>  
        <button>
          <Link href="/episode">
            <a>
              All Episodes
            </a>
          </Link>
        </button>
      </main>
    </div>
  )
}