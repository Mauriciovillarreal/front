import React, { useEffect, useState } from 'react';
import { ItemList } from '../ItemList/ItemList';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import "./ItemListContainer.css";

const getProducts = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/products').then(res => res.json());
        return response;
    } catch (error) {
        console.log(error);
    }
};

const ItemsListContainer = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const products = await getProducts();
            setProducts(products);

            const uniqueBrands = [...new Set(products.map(product => product.brands))];
            const uniqueCategories = [...new Set(products.map(product => product.category))];
            setBrands(uniqueBrands);
            setCategories(uniqueCategories);
        };
        fetchProducts();
    }, []);

    const handleBrandChange = (brand) => {
        setSelectedBrands((prevSelectedBrands) =>
            prevSelectedBrands.includes(brand)
                ? prevSelectedBrands.filter(b => b !== brand)
                : [...prevSelectedBrands, brand]
        );
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories((prevSelectedCategories) =>
            prevSelectedCategories.includes(category)
                ? prevSelectedCategories.filter(c => c !== category)
                : [...prevSelectedCategories, category]
        );
    };

    const filteredProducts = products.filter(product => {
        return (
            (selectedBrands.length ? selectedBrands.includes(product.brands) : true) &&
            (selectedCategories.length ? selectedCategories.includes(product.category) : true)
        );
    });

    return (
        <Container fluid className='containerCard'>
            <aside>
                <div>
                    <h5>MARCA</h5>
                    {brands.map((brand, index) => (
                        <div key={index}>
                            <input
                                type="checkbox"
                                id={`brand-${index}`}
                                value={brand}
                                checked={selectedBrands.includes(brand)}
                                onChange={() => handleBrandChange(brand)}
                            />
                            <label htmlFor={`brand-${index}`}>{brand}</label>
                        </div>
                    ))}
                </div>
                <div>
                    <h5>GÉNERO</h5>
                    {categories.map((category, index) => (
                        <div key={index}>
                            <input
                                type="checkbox"
                                id={`category-${index}`}
                                value={category}
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                            />
                            <label htmlFor={`category-${index}`}>{category}</label>
                        </div>
                    ))}
                </div>
            </aside>
            <Row>
                <ItemList products={filteredProducts} />
            </Row>
        </Container>
    );
};

export default ItemsListContainer;
