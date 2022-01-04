import { useEffect, useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  

  return(
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/Dashboard" element={<Dashboard/>}/>
          <Route path="/" element={<DashboardList/>}/>

        </Routes>
      </Router>
         
         


    </div>
  )

}

const DashboardList = (props) => {
    const [Dashboards, setDashboard] = useState([]);
    const [modalShow, setModal] = useState('')
    const [newDashboardName, setNewName] = useState('')
    const [createNew, setCreateNew] = useState(false);
    const [showProducts, setProducts] = useState(false);
    const [showTotals, setTotals] = useState(false);
    const [showCustomers, setCustomers] = useState(false);
    const [showLatest, setLatest] = useState(false);
    const [showCategories, setCategories] = useState(false);
    const [showDashboards, setShowDashboards] = useState(true);

    const[whichDashboard, setWhichDash] = useState(-1);

    useEffect(() => {
      //retrieve local storage if it exists and create Dashboard components
      let prevConfig = localStorage.getItem("Dashboards");
      
      if(prevConfig != null && prevConfig != "")
      {
        prevConfig = JSON.parse(prevConfig);
        
        prevConfig = prevConfig.map((item, index) => {
          return(<Dashboard key={Math.random() * 1000} configuration={item}/>)
        })
        
        setDashboard(prevConfig);
      }
      else
      {
        window.localStorage.setItem('Dashboards', []);
      }

      const persistDash = localStorage.getItem('which')
      if(persistDash != null && persistDash != '' && persistDash != -1)
      {
        setShowDashboards(false);
        setWhichDash(Number(persistDash))
      }
      


      //if local storage does not have object then create empty array
    }, [])

    // configuration consists of name and what components to render
    const createDashboard = () => {
        const config = {
          ListProducts: showProducts,
          TotalProducts: showTotals,
          CustomerDetail: showCustomers,
          LatestProduct: showLatest,
          Categories: showCategories,
          name: newDashboardName
        }

        config["name"] = config["name"] == '' ? "placeholder" : config["name"];

        const newDash = <Dashboard key={Math.random() * 1000} configuration={config}/>

        setDashboard([...Dashboards, newDash])

        //save object to local storage
        const storage = window.localStorage;
        let prevArray = storage.getItem('Dashboards')
        
        if(prevArray != null && prevArray != '')
        {
          prevArray = JSON.parse(prevArray);
          storage.setItem('Dashboards', JSON.stringify([...prevArray, config]))
        }
        else
        {
          
          storage.setItem('Dashboards', JSON.stringify([config]))
        }

        storage.setItem('which', whichDashboard);




        setCreateNew(false);
        setProducts(false);
        setTotals(false);
        setCustomers(false);
        setLatest(false);
        setCategories(false);
        setNewName('')
    }

    return (
      <div className='dashboard-viewer-container'>
       
        {showDashboards && 
        <div>
          <button className='create-dash' onClick={() => setCreateNew(true)}> Create Dashboard </button>

          <button className='delete-dashboards' onClick={() => localStorage.clear()}>Clear Dashboards </button>

          {Dashboards.length > 0 &&
          <div className='list-dashboard'>
            
              {Dashboards.map((item, index) => {
                return (<button className='dash-btns' key={index} onClick={() => {
                  setWhichDash(index)
                  localStorage.setItem("which", index);
                  setShowDashboards(false);
                }
                 }> {item.props.configuration.name }</button>)
              })
              } 
              
            
          </div>
          }
        </div>
        }

        {createNew && 
          <div className={`modal`}>
            <button onClick={() => setCreateNew(!createNew)} className='close-modal'>x</button>
            <label>Name of Dashboard </label>
            <input type='text' value={newDashboardName} onChange={(event) => {
              setNewName(event.target.value)
            }}/>

            <h4>Cards to show</h4>
            
            <label>Products </label>
            <input type='checkbox' value={showProducts} onChange={(e) => setProducts(!showProducts)}/>

            <label>Total Products </label>
            <input type='checkbox' value={showTotals} onChange={(e) => setTotals(!showTotals)}/>

            <label>Customers </label>
            <input type='checkbox' value={showCustomers} onChange={(e) => setCustomers(!showCustomers)}/>

            <label>Latest product </label>
            <input type='checkbox' value={showLatest} onChange={(e) => setLatest(!showLatest)}/>

            <label>Categories </label>
            <input type='checkbox' value={showCategories} onChange={(e) => setCategories(!showCategories)}/>
            
            <button onClick={createDashboard}> Create New Dashboard</button>
          </div>
        }

        {!showDashboards && 
        <div>
         <button className='available-dash' onClick={() => {
           setShowDashboards(true)
           localStorage.setItem("which", -1);
         }
          }> Available Dashboards </button>
          {Dashboards[whichDashboard]}
        </div>
        }
      </div>
    )

}

/*
1. List of products - Display a list of products. Each product has a title, picture, category, price and description. Please use this endpoint to fetch products: https://fakestoreapi.com/products

2. Total Products - A card that displays the total count of products. Endpoint:  https://fakestoreapi.com/products

3. Customers - A card that displays the customer details (name, email, address and phone no) registered on the website. https://fakestoreapi.com/users

4. Latest product - This card will display any 1 random product (picture, title, category, price). https://fakestoreapi.com/products

5. Display categories - This card will display a list of different product categories. URL: https://fakestoreapi.com/products/categories
*/


const Dashboard = (props) => {
    // const [display, setDisplay] = useState({
    //   ListProducts: true,
    //   TotalProducts: true,
    //   CustomerDetail: true,
    //   LatestProduct: true,
    //   Categories: true
    // })

    



    return(
      <div className='dashboard-container'>
        <div className='dashboard-intro'>
          <h2>{props.configuration.name}</h2>
        </div>

      <div className='block-1'>
        {props.configuration.CustomerDetail &&  
          <CustomerDetail/>
        }
        <div className="small-comps">
          {props.configuration.TotalProducts && 
            <TotalProducts />

          }
          {props.configuration.Categories &&
            <Categories/>
          }


        </div>
      </div>

      <div className="block-2">
        {props.configuration.ListProducts &&
          <ListProducts/>
          
        }
        {props.configuration.LatestProduct &&
          <LatestProduct/>
        }
      </div>

      </div>
    )


}

const ListProducts = (props) => {
  const [products, setProducts] = useState([])
  const [isLoaded, setIsLoaded] = useState(false);

  const productAPI = 'https://fakestoreapi.com/products'
  useEffect(() => {
    fetch(productAPI)
    .then(res => res.json())
    .then(result => {
      setProducts(result)
    })
  }, [])

  return(
    <div className='product-list-container'> 
      <h2>Products </h2>

      {products.map((product, index) => {
        return(
          <div className='product' key={index}>
            <img className='product-img' src={product.image}/>

            <div className='product-details'>
              <h4 className='product-title'>{product.title} | {product.category}</h4>
              <p className='product-price'>${product.price} </p>
              <p className='product-description'>{product.description}</p>

            </div>
          </div>
        )
      })
    }
    </div>
  )


}

const TotalProducts = (props) => {
  const [total, setTotal] = useState(null);

  const productAPI = 'https://fakestoreapi.com/products'
  useEffect(() => {
    fetch(productAPI)
    .then(res => res.json())
    .then(result => setTotal(result.length))
  }, [])

  return (
    <div className='total-products-container'>
      <h2>Product Total </h2>
      <p>Total Number of Products: {total == null ? "loading" : total}</p>
    </div>
  )
}

const CustomerDetail = (props) => {
  const [users, setUsers] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const customerAPI = 'https://fakestoreapi.com/users'
  useEffect(() => {
    fetch(customerAPI)
    .then(res => res.json())
    .then(result => {
      setUsers(result);
      setIsLoaded(true)
    })
  }, [])


  return(
    <div className='customer-detail-container'>
      <h3 >Customers </h3>
      
      {isLoaded && 
      <div>
        {users.map((user, index) => {
          return (
            <div key={index} className='customer'>
              <h2>Customer Details</h2>
              <p className='customer-name'><span>Name:</span> {user.name.firstname} {user.name.lastname} </p>
              <p className='customer-email'><span>Email:</span> {user.email}</p>
              <p className='customer-address'> <span>Address:</span> {user.address.number} {user.address.street}, {user.address.city}, {user.address.zipcode}</p>
            </div>
          )
        })}
      </div>
      }

      {!isLoaded && 
      <div> Loading... </div>
      }
    </div>
  )

}

const LatestProduct = (props) => {
  //picture, title, category, price
  const [item, setItem] = useState({})
  const [isLoaded, setIsLoaded] = useState(false);
  const productAPI = 'https://fakestoreapi.com/products'
  useEffect(() => {
    fetch(productAPI)
    .then(res => res.json())
    .then(result => {
      const max = result.length - 1;
      const random = Math.floor(Math.random() * max);
      setItem(result[random]);
      setIsLoaded(true);
    })
  }, [])

  return (
    <div className='latest-item-container'>
      {isLoaded && 
        <div>
          <div className='latest-item-details'>
            <h3>{item.title} | {item.category} </h3>
            <img className='latest-item-img' src={item.image} />
            <p><span>Price: </span>${item.price}</p>
            <p>{item.description}</p>

          </div>
        </div>
      }
      {!isLoaded && 
        <p>Loading...</p>
      }
    </div>
  )


}

const Categories = (props) => {
  const [categories, setCategories] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products/categories")
    .then(res => res.json())
    .then(result => {
      setCategories(result)
      setIsLoaded(true)
    })
  }, [])

  return(
    <div className='categories-container'>

      {isLoaded && 
        <div>
        {categories.map((item, index) => {
          return(<div className='category' key={index}>
            <p>{item}</p>
          </div>)
        })}
        </div>
      }

      {!isLoaded &&
        <div> Loading... </div>
      }
    </div>
  )

}


export default App;
