import Head from 'next/head'
import styles from '../../../styles/Home.module.css'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import localforage from "localforage";


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
  const [favId, setFavId] = useState(0);

  localforage.getItem('fav', function(err, value) {
    // Run this code once the value has been
    // loaded from the offline store.
    setFavId(value);
    return;
  }).catch(function(err) {
    // This code runs if there were any errors
    console.log(err);
  });
  
  
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
        <title>Explore Rick and Morty</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"></link>
      </Head>

      <div className={styles.navbar}>
        <ul className={styles.menu}>
          <li>
            <Link href="/">
              <a>All Characters</a>
            </Link>
          </li>
          <li>
            <Link href="/episode">
              <a>All Episodes</a>
            </Link>
          </li>
        </ul>
      </div >

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
              <Link href="/episode">
                <a>
                  <p>Back to all Episodes</p>
                </a>
              </Link>
          </ul>
        </div>
        <h2>All Characters </h2>
        <div>
          {charactersAll.map(character => {
            const { id, name, image} = character
            let favClass = ''
            if ( id === favId) {
              favClass = 'fa fa-heart';
            }
              return (
                <ul key={id}  className={styles.character_list}>
                  <li>
                    <Link href="/character/[id]" as={`/character/${id}`}>
                      <a>
                        <img src={image} alt={`${name}`} className={styles.avatar_small} />
                        <p className={styles.character_list_details}> { name } <i className={favClass}></i></p>
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