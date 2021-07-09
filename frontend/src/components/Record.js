import React from "react";
import BeautyStars from "beauty-stars";

function Record({ role, index, history, item, handleDelete }) {
  return (
    <tr>
      <td>{index + 1}</td>
      <td onClick={() => history.push(`/restaurants/${item.id}`)}>
        {item.name}
      </td>
      <td>{item.description}</td>
      {item.rating === null ? (
        <td>
          <span>No rating yet</span>
        </td>
      ) : (
        <td>
          <BeautyStars
            value={item.rating}
            editable={false}
            size={16}
            gap={4}
            editable={false}
          />
        </td>
      )}

      {role !== "user" && (
        <td>
          <a onClick={() => history.push(`/restaurant/${item.id}`)}>Edit</a>
          <a onClick={() => handleDelete(item.id)}>Delete</a>
        </td>
      )}
    </tr>
  );
}

export default Record;
