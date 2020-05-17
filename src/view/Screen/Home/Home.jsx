import React from "react";
import "./Home.css";
import { Carousel, CarouselControl, CarouselItem } from "reactstrap";
import { Link } from "react-router-dom";
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
    bestSellerData: [],
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
              <div className="row" style={{ paddingTop: "80px" }}>
                <div className="col-6 text-white position-relative"></div>
                <div className="col-12 d-flex flex-row justify-content-center">
                  <img
                    src={image}
                    alt=""
                    style={{ height: "750px", objectFit: "contain" }}
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
  render() {
    return (
      <div>
        <div className="d-flex justify-content-center flex-row align-items-center my-3">
          <Link
            to="/"
            style={{ color: "inherit" }}
            onClick={() => this.setState({ categoryFilter: "" })}
          >
            <h6 className="mx-4 font-weight-bold">Boygroup</h6>
          </Link>
          <Link
            to="/"
            style={{ color: "inherit" }}
            onClick={() => this.setState({ categoryFilter: "phone" })}
          >
            <h6 className="mx-4 font-weight-bold">All</h6>
          </Link>
          <Link
            to="/"
            style={{ color: "inherit" }}
            onClick={() => this.setState({ categoryFilter: "laptop" })}
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
      </div>
    );
  }
}

export default Home;
