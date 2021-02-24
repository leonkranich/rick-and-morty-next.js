import Head from 'next/head'
import styles from '../../../styles/Home.module.css'
import Link from 'next/link';
import { useState, useEffect } from 'react';

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
  const [episodes, setEpisodes] = useState([]);
  
  useEffect(() => {
    let idArray = [];
    episode.map(ep => {
      const splitted = ep.split('/');
      const lastElements = splitted[splitted.length -1];
      idArray.push(lastElements);
    });
    const ids = idArray.join(',');
    
    async function request() {
      const res = await fetch(`https://rickandmortyapi.com/api/episode/${ids}`)
      const newData = await res.json();
      setEpisodes(newData);
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
              <li>
                
              </li>
            </ul>
           </div>
        </div> 
        <div className={styles.episode_list}>
          <h2>All Episodes </h2>
             {episodes.map(episode => {
              const { id, name} = episode
                return (
                  <ul key={id}>
                    <li>
                      <Link href="/episode/[id]" as={`/episode/${id}`}>
                        <a>
                          <p>Nr: { id } { name }</p>
                        </a>
                      </Link>
                    </li>
                  </ul>
                )
              })} 
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