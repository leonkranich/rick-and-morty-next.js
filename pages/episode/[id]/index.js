import Head from 'next/head'
import styles from '../../../styles/Home.module.css'
import Link from 'next/link';
import { useState, useEffect } from 'react';

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
  const [charactersAll, setCharacters] = useState([]);
  
  useEffect(() => {
    let idArray = [];
    characters.map(ch => {
      const splitted = ch.split('/');
      const lastElements = splitted[splitted.length -1];
      idArray.push(lastElements);
    });
    const ids = idArray.join(',');
    
    async function request() {
      const res = await fetch(`https://rickandmortyapi.com/api/character/${ids}`)
      const newData = await res.json();
      setCharacters(newData);
    }
    request();
  }, [])
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
        <h2>All Characters </h2>
        <div>
          {charactersAll.map(character => {
            const { id, name, image} = character
              return (
                <ul key={id}  className={styles.character_list}>
                  <li>
                    <Link href="/character/[id]" as={`/character/${id}`}>
                      <a>
                        <img src={image} alt={`${name}`} className={styles.avatar_small} />
                        <p className={styles.character_list_details}> { name }</p>
                      </a>
                    </Link>
                  </li>
                </ul>
              )
            })} 
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