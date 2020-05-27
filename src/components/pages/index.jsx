import React from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";
import Graph from "./graph";
import { TiArrowSortedUp } from 'react-icons/ti';

const styles = {
  SmallBrac: {
    color: "grey",
  },
  Header: {
    padding: "10px 20px",
    textAlign: "center",
    color: "white",
    fontSize: "22px"
  },
  ErrorMessage: {
    color: "white",
    fontSize: "13px"
  },
  TableRow:{
    backgroundColor: "rgb(255, 102, 0)",
    color: "white",
  },
  UpvoteButton:{
    color: "#6c757d",
    display: "block",
    margin: "auto"
  },
  ColorSchema:{
    color: "rgb(255, 102, 0)"
  },
  Divider:{
    color: "rgb(255, 102, 0)",
    paddingTop:"0.3em"
  },
  HorizontalRow:{
    backgroundColor: "rgb(255, 102, 0)",
    height: "0.04em",
    marginTop:"1.7rem"
  },
  TextButton:{
  backgroundColor:"transparent",
  color:"black",
  border: "none",
  padding: "0.001em",
  fontSize: "1em",
  cursor: "pointer",
  display: "inline-block"
  }
}

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      pageNo: 0,
      TotalPage: 0,
      Hiddenrow:''
    };

   this.hideHandler=this.hideHandler.bind(this);
   this.showHandler=this.hideHandler.bind(this);
   this.renderNews=this.renderNews.bind(this);
  }

  DataHandler(pageNumber) {
    let url = `https://hn.algolia.com/api/v1/search?page=${pageNumber}`;
    axios
      .get(url, {
        responseType: "json"
      })
      .then(response => {
        this.setState({
          tableData: response.data.hits,
          pageNo: pageNumber,
          TotalPage: response.data.nbPages
        });
        console.log("res: ", this.state.tableData);
      });
  }

/*   hideHandler = () => {
    console.log("inside handleclick")
    //this.props.onReOrder(e.target.id, this.props.orderDir)
} */
  

  componentDidMount() {
    this.DataHandler(0);
  }


   SaveDataToLocalStorage=(data)=>
{
    let a,unique = [];
    // Parse the serialized data back into an aray of objects
    a = JSON.parse(localStorage.getItem('session')) || [];
  
    // Push the new data (whether it be an object or anything else) onto the array
    a.push(data);
    // Alert the array value
    unique = a.filter((data, i, a) => a.indexOf(data) === i); 
    // Should be something like [Object array]
    // Re-serialize the array back into a string and store it in localStorage
    localStorage.setItem('session', JSON.stringify(unique));
    this.setState({
      Hiddenrow:JSON.parse(localStorage.getItem('session')) || [],
    })
}

RemoveDataFromLocalStorage=(dataval)=>
{
 console.log("inside RemoveDataFromLocalStorage")
    var arrayrem = [];
    // Parse the serialized data back into an aray of objects
    arrayrem = JSON.parse(localStorage.getItem('session')) || [];
    var index = arrayrem.indexOf(dataval);
    console.log("index",index)
    // Push the new data (whether it be an object or anything else) onto the array
    // Alert the array value
    // Should be something like [Object array]
    // Re-serialize the array back into a string and store it in localStorage
    if (index !== -1) arrayrem.splice(index, 1);
    console.log("before writing",arrayrem)
    localStorage.setItem('session', JSON.stringify(arrayrem));
    this.setState({
      Hiddenrow:JSON.parse(localStorage.getItem('session')) || [],
    })
}
 //onClick={this.hideHandler(index)}

 hideHandler=(index)=> {
  console.log('index: ',index);
  this.SaveDataToLocalStorage(index);
  console.log("updated state",localStorage.getItem('session'));
  
}
showHandlerNew=(indexval)=> {
  console.log('index show: ',indexval);
  this.RemoveDataFromLocalStorage(indexval);
  console.log("updated state in show",localStorage.getItem('session'));
  
}

  renderNews(news, index) {

    let d = new Date(news.created_at);
    var diffTime = Date.now() - d;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const LocalStorageArray = JSON.parse(localStorage.getItem('session'))||[];
    return (
      LocalStorageArray.includes(index)?<tr key={index}><td></td><td></td><td></td><td> <small style={styles.SmallBrac}>[ </small><small><Button style={styles.TextButton}
      onClick={() => this.showHandlerNew(index)}
      >Show</Button></small><small style={styles.SmallBrac}>] </small></td></tr> : 
      <tr key={index}>
        <td>{news.num_comments?news.num_comments:'0'}</td>
        <td>{news.points}</td>
        <td>
          <a style={styles.UpvoteButton} href='#' >{<TiArrowSortedUp style={styles.UpvoteButton}/>/* <Button variant="primary btn-sm" style={styles.UpvoteButton}><TiArrowSortedUp/></Button> {" "} */}</a>
        </td>
        <td>
          {news.title}{" "}
          <small style={styles.SmallBrac}>
            (<a href={news.url}>{news.url}</a>) by{" "}
          </small>
          <small> {news.author} </small>
          <small style={styles.SmallBrac}> {diffDays} days ago. [ </small>
          <small><Button style={styles.TextButton}
          onClick={() => this.hideHandler(index)}
          >Hide</Button></small>
          <small style={styles.SmallBrac}>] </small>
        </td>
      </tr>
    );
  }

  paginationHandler(GoToPageNo) {
    if (GoToPageNo >= 0) {
      this.DataHandler(GoToPageNo);
    }else{
        console.log(`Can't fetch data for page -1`)
    }
  }


  render() {
    const data = this.state.tableData;
    return (
      <div>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
          integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
          crossorigin="anonymous"
        />

        <Card>
          <Card.Body>
          <Card.Body>
            <div>
            <h3 >Hacker News </h3>

            {/*<FontAwesomeIcon icon={faCoffee} />*/}
            <Table striped bordered hover size="sm" responsive="md">
              <thead>
                <tr style={styles.TableRow}>
                  <th>Comments</th>
                  <th>VoteCount</th>
                  <th>UpVote</th>
                  <th>News Details</th>
                </tr>
              </thead>
              <tbody>{data.map(this.renderNews)}</tbody>
            </Table>
            <h5>
            <Button
             style={styles.ColorSchema}
                variant=""
                size="sm"
                className="btn float-right"
                onClick={() => this.paginationHandler(this.state.pageNo + 1)}
              >
                Next
              </Button>
              <div className="float-right" style={styles.Divider}>|{" "}</div>
              <Button
                 style={styles.ColorSchema}
                variant=""
                size="sm"
                className="btn float-right"
                onClick={() => this.paginationHandler(this.state.pageNo - 1)}
              >
                Previous
              </Button>{" "} 
            </h5>
            </div>
            </Card.Body>
            <hr style={styles.HorizontalRow}/>
            <Card.Body>
              <Graph data={data} />
            </Card.Body>
            <hr style={styles.HorizontalRow}/>
          </Card.Body>
        </Card>
      </div>
    );
  }
}


export default Index;
