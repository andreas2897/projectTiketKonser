import React from "react";
import "./Home.css";
import { Carousel, CarouselControl, CarouselItem } from "reactstrap";
import { Link } from "react-router-dom";
import { API_URL } from "../../../constants/API";

import Axios from "axios";
import ProductCard from "../../../view/components/Cards/ProductCard"

import Blackpink from "../../../assets/images/showcase/Blackpink.jpg";
import Twice from "../../../assets/images/showcase/Twice.jpg";
import redVelvet from "../../../assets/images/showcase/RedVelvet.jpg";

const dummy = [
  {
    image: Blackpink,
    id: 1,
  },
  {
    image: Twice,
    id: 2,
  },
  {
    image: redVelvet,
    id: 3,
  },
];

class Home extends React.Component {
  state = {
    activeIndex: 0,
    animating: false,
    concertData: [],
    categoryFilter: "",
  };

  renderCarouselItems = () => {
    return dummy.map(({ image, id }) => {
      return (
        <CarouselItem
          onExiting={() => this.setState({ animating: true })}
          onExited={() => this.setState({ animating: false })}
          key={id.toString()}
        >
          <div className="carousel-item-home">
            <div className="container position-relative">
              <div className="row" style={{ paddingTop: "30px" }}>
                <div className="col-6 text-white position-relative"></div>
                <div className="col-12 d-flex flex-row justify-content-center">
                  <img
                    src={image}
                    alt=""
                    style={{ height: "500px", objectFit: "contain" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CarouselItem>
      );
    });
  };

  nextHandler = () => {
    if (this.state.animating) return;
    let nextIndex =
      this.state.activeIndex === dummy.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  };

  prevHandler = () => {
    if (this.state.animating) return;
    let prevIndex =
      this.state.activeIndex === 0
        ? dummy.length - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: prevIndex });
  };

  getConcertData = (currCategory = null) => {
    Axios.get(`${API_URL}/concerts`, {
      params: {
        category: currCategory,
      },
    })
      .then((res) => {
        console.log(res.data);
        this.setState({ concertData: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getConcertData();

  }

  renderConcert = () => {
    return this.state.concertData.map((val) => {
    
      return (<Link
        style={{ textDecoration: "none", color: "inherit" }}
        to={`/product/${val.id}`}
      >
        <ProductCard data={val} className="m-2" />
      </Link>);
    });
    
  };

  render() {
    return (
      <div>
        <div className="d-flex justify-content-center flex-row align-items-center my-3">
          <Link
            to="/"
            style={{ color: "inherit" }}
            onClick={() => this.setState({ categoryFilter: "boygroup" })}
          >
            <h6 className="mx-4 font-weight-bold">Boygroup</h6>
          </Link>
          <Link
            to="/"
            style={{ color: "inherit" }}
            onClick={() => this.setState({ categoryFilter: "" })}
          >
            <h6 className="mx-4 font-weight-bold">All</h6>
          </Link>
          <Link
            to="/"
            style={{ color: "inherit" }}
            onClick={() => this.setState({ categoryFilter: "girlgroup" })}
          >
            <h6 className="mx-4 font-weight-bold">GirlGroup</h6>
          </Link>
        </div>

        <Carousel
          className="carousel-item-home-bg "
          next={this.nextHandler}
          previous={this.prevHandler}
          activeIndex={this.state.activeIndex}
        >
          {this.renderCarouselItems()}
          <CarouselControl
            directionText="Previous"
            direction="prev"
            onClickHandler={this.prevHandler}
          />
          <CarouselControl
            directionText="Next"
            direction="next"
            onClickHandler={this.nextHandler}
          />
        </Carousel>
        <div className="row d-flex flex-wrap justify-content-center">
        {this.renderConcert()}
        </div>
        <div className="py-5" style={{ marginTop: "100px", backgroundColor: "#ffcce5"}}>
        <div className="col-4 text-center d-flex flex-column align-items-center">
                <img src="https://image.flaticon.com/icons/png/512/1325/1325982.png" alt="" height="300px" width="300px"/>
                <h3 className="font-weight-bolder mt-4">100% REFUND</h3>
                <p className="mt-4">
                If you are not 100% satisfied with your purchase, you can return the product and get a full refund or exchange the product for another one, be it similar or not.
                </p>
              </div>
        </div>
        <footer className="text-center"> 
          <h5>Copyright 2020 AS Entertaiment</h5>
        </footer>
      </div>
    );
  }
}

export default Home;
