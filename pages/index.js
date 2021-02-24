import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react';
import React from 'react';
import { useForm } from "react-hook-form";
import Link from 'next/link';
import localforage from "localforage";


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
  const [favId, setFavId] = useState();
  
  localforage.getItem('fav', function(err, value) {
    // Run this code once the value has been
    // loaded from the offline store.
    setFavId(value);
    return;
  });
  
  // Similar to componentDidMount and componentDidUpdate:
  const { ongoing } = page;
  useEffect(() => {
    if ( ongoing === Endpoint ) return;

    async function request() {
      const res = await fetch(ongoing)
      const newData = await res.json();
      
      updatePage({
        ongoing,
        ...newData.info
      }); 

      // console.log(newData.info.prev);
      // prevent same keys
      if ( !newData.info.prev ) {
        updateResults(newData.results);
        return;
      }
  // concatenate new results to old
      updateResults(prev => {
        return [
          ...prev,
          ...newData.results
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
        ongoing: page.next
      }
    });
  }
  const {register, handleSubmit} = useForm();

  const handleSearch = event => {
    const query = event.input;
    const endpointSearch = `https://rickandmortyapi.com/api/character/?name=${query}`;

    updatePage({
      ongoing: endpointSearch
    })
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>Explore Rick and Morty</title>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"></link>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
           Rick & Morty Characters
        </h1>

        <p className={styles.description}>
          Sometimes Science Is More Art Than Science, Morty
        </p>
        
        <form className={styles.search_form} onChange={handleSubmit(handleSearch)}>
          <input ref={register} name="input" type="text" placeholder="Find characters" />
          {/* <button>Search</button> */}
        </form>

        <ul className={styles.grid}>
          {results.map(result => {
            const { id, name, image } = result;
            let favClass = ''
            if ( id === favId) {
              favClass = 'fa fa-heart'
              // console.log(favClass, id);
            }
            
            return (
              <li key={id} className={styles.card}>
                <Link href="/character/[id]" as={`/character/${id}`}>
                  <a>
                    <img src={image} alt={`${name}`} className={styles.avatar} />
                    <h2>{ name } <div className={styles.heart}><i className={favClass}></i></div></h2>
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
        <button onClick={handleLoadMore}>Load More</button>
      </main>
    </div>
  )
}