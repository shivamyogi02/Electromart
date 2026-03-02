import React from 'react'


export default function CategoryBar({categories, onSelect}){
return (
<div className="category-bar card">
{categories.map(cat=> (
<div key={cat} className="category-item" onClick={()=>onSelect(cat)}>
<div className="category-icon">{cat[0]}</div>
<div className="small">{cat}</div>
</div>
))}
</div>
)
}