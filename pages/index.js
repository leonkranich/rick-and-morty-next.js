import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Endpoint = `https://rickandmortyapi.com/api/character/`;

export async function getServerSideProps() {
  const res = await fetch(Endpoint)
  const data = await res.json();
  return {
    props: {
      data
    }
  }
}

export default function Home({ data }) {
  // destructuring from data object
  const { results = [] } = data;
  console.log(results);
  return (
    <div className={styles.container}>
      <Head>
        <title>Sometimes Science Is More Art Than Science, Morty</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
           Rick and Morty
        </h1>

        <p className={styles.description}>
          Sometimes Science Is More Art Than Science, Morty
        </p>

        <ul className={styles.grid}>
          {results.map(result => {
            const { id, name, image } = result;
            return (
              <li key={id} className={styles.card}>
                <a href="#">
                  <img src={image} alt={`${name}`} className={styles.avatar} />
                  <h2>{ name }</h2>
                </a>
              </li>
            )
          })}
        </ul>
      </main>
    </div>
  )
}
