import Head from 'next/head'
import styles from '../../../styles/Home.module.css'
import Link from 'next/link';

const Endpoint = `https://rickandmortyapi.com/api/character/`;

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

export default function Character({ data }) {
  const { name, image, gender, location, origin, species, status, episode } = data;

  console.log({ episode });
  return (
    <div className={styles.container}>
      <Head>
        <title>Sometimes Science Is More Art Than Science, Morty</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.character_details}>
          <div className={styles.character_image}>
            <img src={image} alt={name} />
          </div>
          <div>
          <h3> { name } </h3>
            <ul>
              <li>
                <strong>Status:</strong> { status }
              </li>
              <li>
                <strong>Gender:</strong> { gender }
              </li>
              <li>
                <strong>Species:</strong> { species }
              </li>
              <li>
                <strong>Location:</strong> { location.name }
              </li>
              <li>
                <strong>Origin:</strong> { origin.name }
              </li>
            </ul>
           </div>
        </div>  
        <button>
          <Link href="/">
            <a>
              All Characters
            </a>
          </Link>
        </button>
      </main>
    </div>
  )
}