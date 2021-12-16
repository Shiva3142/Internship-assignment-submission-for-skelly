import React from 'react'
import '../../css/Product.css'

function Product(object) {
    return (
        <>
            <div className="productDetails">
                <div className="pdtimg">
                    <div className="productImage">
                        <img src={object.data.image} alt="" />
                    </div>
                </div>
                <div className="productInfo">
                    <h4>{object.data.product_name}</h4>
                    <p>#{object.data.product_id}</p>
                </div>
                <div className="productPrice">
                    ${object.data.price}
                </div>
            </div>
        </>
    )
}

export default Product
