import React, { useContext, useEffect, useState } from "react";
import { PostContext } from "../../contextStore/PostContext";
import { Firebase } from "../../firebase/config";
import { useHistory } from "react-router";
import "./View.css";
import { Link } from "react-router-dom";

function View() {
  let { postContent } = useContext(PostContext);

  const [userDetails, setUserDetails] = useState();
  const history = useHistory();

  const handleBuyerClick = () => {
    // Ensure that userDetails and postContent are defined
    if (userDetails && postContent) {
      const chatPath = `/chat?sellerUserId=${userDetails.id}&buyerUserId=${postContent.userId}`;
      history.push(chatPath);
    }
  };



  useEffect(() => {
    let { userId } = postContent;
    if (userId === undefined) {
      history.push("/");
    } else {
      Firebase.firestore()
        .collection("users")
        .where("id", "==", userId)
        .get()
        .then((res) => {
          res.forEach((doc) => {
            setUserDetails(doc.data());
          });
        });
    }
  }, [history, postContent]);

  return (
    <div className="viewParentDiv">
      <div className="imageShowDiv">
        <img src={postContent.url} alt="" />
      </div>
      <div className="rightSection">
        <div className="productDetails">
          <p>&#x20B9; {postContent.price} </p>
          <span>{postContent.name}</span>
          <p>{postContent.category}</p>
          <span>{postContent.createdAt}</span>
        </div>
        <div className="productDescription">
          <p className="p-bold">Product Description</p>
          <p>{postContent.description}</p>
        </div>
        {userDetails && (
          <div className="contactDetails">
            <p className="p-bold">Seller details</p>
            <p>Name : {userDetails.name}</p>
            <p>Phone : {userDetails.phone}</p>
            <p>Location:{userDetails.Location}</p>
          </div>
        )}
        <Link to="/app.js" onClick={handleBuyerClick}>Buy</Link>

      </div>
    </div>
  );
}

export default View;
