import axios from "axios"
import { useEffect, useState } from "react"

function App() {
  const [articles, setArticles] = useState<any>([])

  useEffect(() => {
    const loadNews = async () => {
      let response = await axios.get('http://localhost:8000/all')
      response = await response.data
      setArticles(response)
    }
    loadNews()
  }, [])
  console.log(articles);
  
  return (
    <ul
      style={{
        padding: "2rem"
      }}
    >
      {
        articles.map((article: any, index: any) => {
          return <li
            key={index}
            style={{
              listStyle: "none"
            }}
          >
            <div
              style={{
                display: "flex",
                marginTop: "1rem",
                boxShadow: "0px 1px 18px -5px #000000",
                padding: "1rem",
                borderRadius: "5px"
              }}
            >
              {article?.image && <img 
                src={article.image}
                alt="post illustration"
                style={{
                  width: "250px",
                  height: "250px",
                  borderRadius: "50%"
                }}
              />}
              <div
                style={{
                  marginLeft: "2rem"
                }}
              >
                <h2>{article.title}</h2>
                <a href={article.post_url}>lire</a>
              </div>
            </div>
          </li>
        })
      }
    </ul>
  )
}

export default App
