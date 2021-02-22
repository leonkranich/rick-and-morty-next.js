import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react';

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
  // destructuring from data object and set states
  const { info, results: defaultResults = [] } = data;
  const [results, updateResults] = useState(defaultResults);
  // spread operator alter!!
  const [page, updatePage] = useState({
    ...info,
    ongoing: Endpoint
  });
  const { ongoing } = page;

// Similar to componentDidMount and componentDidUpdate:
useEffect(() => {
  if ( ongoing === Endpoint ) return;

  async function request() {
    const res = await fetch(ongoing)
    const nextData = await res.json();

    updatePage({
      ongoing,
      ...nextData.info
    }); 
// concatenate new results to old
    updateResults(prev => {
      return [
        ...prev,
        ...nextData.results
      ]
    });
  }

  request();
}, [ongoing]); 
// only if this changes the hook will go
function handleLoadMore() {
  updatePage(prev => {
    return {
      ...prev,
      ongoing: page?.next
    }
  });
}
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
        <button onClick={handleLoadMore}>Load More</button>
      </main>
    </div>
  )
}
