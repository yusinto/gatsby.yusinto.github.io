import React from 'react';

export default ({tags}) => (
  <ul>
    {
      tags.map(t => {
        return <li key={t}>{t}</li>
      })
    }
  </ul>
)