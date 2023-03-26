import { type } from 'os';
import React from 'react';
import {useState, useEffect} from "react"
import './App.css';
import axios from "axios"
import PokemonCollection from './components/PokemonCollection';
import { Pokemon } from './interface';

// Typescript co ban

// typescript dinh nghi kieu bien ngay sau no, se giup chat che hon neu nhu ko dung type dc dinh nghia
// let name:string = "Thang"
// // name = 12 //ko dc
// let age:number = 20
// let sleep:boolean = false
// let myArr:string[] = ["John", "Kelvin"] 
// // myArr[0] = 4 //ko dc

// let address:any = "Bacninh" //type any dung type nao cx dc, giong js (nen han che dung)
// address = 99

// type Student = { //dinh nghia type chung cho object
//   name: string,
//   age: number,
// };
// let student:Student = {
//   name: "Jeny",
//   age: 20
// }
// student.name = "Thang"
// // student.name = 50 //ko dc

// //type va interface gan nhu giong het nhau (nen dung interface)
// interface Student2 { //interface ko cần dấu =
//   name: string,
//   age: number,
// }
// let student2:Student2 = {
//   name: "John",
//   age: 23
// }

// // Ke thua doi vs type
// type Name = {
//   name: string,
// }
// type StudentDetails = Name & { //ke thua tat ca thuoc tinh trong type Name
//   age: number,
//   address: string
// }
// let student3 : StudentDetails = { //phai co day du cac thuoc tinh tu type dc ke thua
//   name: "John",
//   age: 20,
//   address: "BN"
// }

// // Ke thua vs interface
// interface Name2 {
//   name: string,
// }
// interface StudentDetails2 extends Name2 { //ke thua tat ca thuoc tinh trong type Name
//   age: number,
//   address?: string //neu muon thuoc tinh nay la optional cho user khi nhap -> dung` ?
// }
// let student4 : StudentDetails2 = { //luc nay co hay ko co address cung dc, ko bi loi
//   name: "John",
//   age: 20,
//   // address: "BN"
// }


// // doi vs function
// const printSomething:() => void = () => { //()=>void cho type script biet day la function va return kieu void tuc la ko co return
//   // console.log('Thang');
// }

// const printSomething2:() => string = () => { //return kieu string
//   let name:string = "Daniel"
//   return name
// }

// const printSomething3:(age:number) => string[] = (age:number) => { //return kieu string[]
//   let name:string[] = ["Jenny", "John"]
//   age = 20
//   // age = "20" //sai
//   return name
// }


interface Pokemons {
  name: string,
  url: string
}

export interface Detail {
  id: number,
  isOpened: boolean
}

const App:React.FC = () => { //React.FC (functional component) de cho biet App nay la 1 component
  const [pokemons, setPokemons] = useState<Pokemon[]>([]) //trong api nay co nhieu pokemon nen la 1 array -> Pokemon[] (tao interface vi neu de la string[] nhung id lai la number -> ko dc)
  const [nextUrl, setNextUrl] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [viewDetail, setDetail] = useState<Detail>({
    id: 0,
    isOpened: false
  })
  useEffect(() => { //tac dung goiAPI ve khi lan dau load trang
    const getPokemons = async () => {
      const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=20&offset=20") //cac pokemon nhung chi gom name va url
      // console.log(res.data);
      setNextUrl(res.data.next)
      res.data.results.forEach(async(pokemon : Pokemons) => {
        const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`) //chi tiet tung con pokemon
        // console.log(poke.data);
        setPokemons((p) => [...p, poke.data]) //do poke.data gom cac object chu ko phai array (lam ntn de chuyen no sang array de teo nua dung map() in tung pokemon ra)
      setLoading(false)
      })
    }
    getPokemons()
  }, [])

  const nextPage = async () => {
    setLoading(true)
    let res = await axios.get(nextUrl)
    setNextUrl(res.data.next)
    res.data.results.forEach(async(pokemon:Pokemons)=>{ //type Pokemons
      const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
      setPokemons((p) => [...p, poke.data])
      setLoading(false)
    })

  }

  return (
    <div className="App">
      <div className="container">
        <header className="pokemon-header">Pokemon</header>
        <PokemonCollection pokemons={pokemons} viewDetail={viewDetail} setDetail={setDetail}/>
        {!viewDetail.isOpened && ( //khi mk dong' thi moi co chu load more
          <div className='btn'>
            <button onClick={nextPage}> {loading ? "Loading..." : "Load more"} </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
