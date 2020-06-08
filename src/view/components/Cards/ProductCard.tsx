import React from "react";
import "./ProductCard.css";
import ButtonUI from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStar } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";

interface ProductCardData {
  id : number;
  concertName: string;
  artist: number;
  review: number;
  image: string;
  location : string;
}

type ProductCardProps = {
  data: ProductCardData;
  className?: string;
};

class ProductCard extends React.Component<ProductCardProps> {
  render() {
    const { id, concertName, artist, review, image } = this.props.data;

    return (
      <div className={`product-card d-inline-block ${this.props.className}`}>
        <img
          src={image}
          alt={this.props.data.concertName}
          style={{ width: "224px", height: "250px", objectFit: "contain" }}
        />
        <div>
          <p className="mt-3">{concertName}</p>
          <h5 style={{ fontWeight: "bolder" }}>
          {this.props.data.artist}
          </h5>
          <p className="small">{this.props.data.location}</p>
        </div>
        <div className="d-flex flex-row align-items-center justify-content-between mt-2">
          <div>
            <div className="d-flex flex-row align-items-center justify-content-between">
              {/* Render stars dynamically */}
              <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
              <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
              <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
              <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
              <FontAwesomeIcon style={{ fontSize: "10px" }} icon={faStar} />
              <small className="ml-2">4.5</small>
            </div>
          </div>
          <ButtonUI
            type="outlined"
            style={{ fontSize: "12px", padding: "4px 8px" }}
          >
            {" "}
            <FontAwesomeIcon icon={faHeart} /> Add to wishlist
          </ButtonUI>
        </div>
      </div>
    );
  }
}

export default ProductCard;
