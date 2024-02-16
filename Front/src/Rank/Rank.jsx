import React, { useEffect, useState } from 'react'
import './Rank.css'
import axios from 'axios';

const Rank = () => {
  const [rankings, setRankings] = useState([]);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/ranking`);
        setRankings(response.data);
        const username = localStorage.getItem('username');
        const rank = response.data.findIndex(ranking => ranking.username === username) + 1;
        setUserRank(rank);
      } catch (error) {
        console.error('Error ranking', error);
      }
    };

    fetchRankings();
  }, []);

  const getRank = (index) => {
    if (index === 0)
      return '🥇';
    else if (index === 1)
      return '🥈';
    else if (index === 2)
      return '🥉';
    else
      return index + 1;
  }

  return (
    <div className='rank'>
      <h2 className='rankTitle'>Worldwide Rank</h2>
      {userRank && <p className='userRank'>Your rank: {userRank}</p>}
      <div className="table-responsive" style={{ width: '90%', margin: 'auto' }}>
        <table className="table table-bordered table-hover mb-5">
          <thead className="thead-light">
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Username</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((ranking, index) => (
              <tr key={index}>
                <td>{getRank(index)}</td>
                <td>{ranking.username}</td>
                <td>{ranking.bestScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Rank