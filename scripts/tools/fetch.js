async function fetchData(URL) {
  const data = await fetch(URL)
    .then(res => res.json())
  
  return data;
}

export default fetchData;