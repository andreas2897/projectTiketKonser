import React from "react";
import "./ProductCard.css";
import ButtonUI from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStar } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";

interface ProductCardData {
  id: number;
  concertName: string;
  concertArtist: number;
  review: number;
  concertImage: string;
  concertLocation: string;
}

type ProductCardProps = {
  data: ProductCardData;
  className?: string;
};

class ProductCard extends React.Component<ProductCardProps> {
  render() {
    const {
      id,
      concertName,
      concertArtist,
      review,
      concertImage,
    } = this.props.data;

    return (
      <div className={`product-card d-inline-block ${this.props.className}`}>
        <img
          src={concertImage}
          alt={this.props.data.concertName}
          style={{ width: "224px", height: "250px", objectFit: "contain" }}
        />
        <div>
          <p className="mt-3">{concertName}</p>
          <h5 style={{ fontWeight: "bolder" }}>
            {this.props.data.concertArtist}
          </h5>
          <p className="small">{this.props.data.concertLocation}</p>
        </div>
      </div>
    );
  }
}

export default ProductCard;
