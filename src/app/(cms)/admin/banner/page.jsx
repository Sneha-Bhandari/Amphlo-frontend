import React from 'react'

function page() {


    const bannersection = [
        { name: "About us" },
        { name: "Vision & Mission" },
        { name: "Services & Offerings" },

    ]


    return (
        <div>
           <div className='flex gap-9'>
             {
                bannersection.map((val, i) => {
                    return (
                        <div>
                            {val.name}
                        </div>
                    )
                })
            }
           </div>
        </div>
    )
}

export default page
