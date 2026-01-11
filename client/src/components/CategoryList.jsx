import React, { useState, useEffect } from 'react'
import { ProductCategoryList } from "../APIRequest/APIRequest"
import { useNavigate } from 'react-router-dom';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const handleCategoryClick = (categoryID) => {
        navigate(`/products?category=${categoryID}`);
    }

    useEffect(() => {
        (async () => {
            let data = await ProductCategoryList();
            if (data && Array.isArray(data)) {
                setCategories(data);
            } else if (data && data.data && Array.isArray(data.data)) {
                setCategories(data.data);
            }
        })()
    }, []);

    return (
        <div className="text-center pt-10 pb-15 bg-base-100 text-base-content">
            {!categories[0] ?
                <>
                    <div className="mb-6 flex justify-center items-center">
                        <div className="skeleton h-8 w-100"></div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 m-3">
                                <div className="skeleton h-25 w-25 shrink-0 rounded-full"></div>
                                <div className="skeleton h-4 w-20"></div>
                            </div>
                        ))}
                    </div>
                </>
                :
                <>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">Select Your Category</h2>
                        <hr className="h-[2px] border-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent w-1/3 mx-auto" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                        {categories.map((category) => (
                            <div
                                key={category['_id']}
                                className="flex flex-col m-3 items-center cursor-pointer hover:scale-115 transition-transform"
                                onClick={() => handleCategoryClick(category['_id'])}
                            >
                                <img src={category.categoryImg} alt={category.categoryName} className="w-25 h-25 mb-2 rounded-full object-cover bg-gray-200 shadow-md" />
                                <h5 className="text-center font-medium">{category.categoryName}</h5>
                            </div>
                        ))}
                    </div>
                </>
            }
        </div>
    )
}

export default CategoryList