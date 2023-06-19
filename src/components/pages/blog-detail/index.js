import React, {useEffect} from "react";
import {useParams} from 'react-router-dom'
export default () => {

    const {slug} = useParams()

    useEffect(() => {

    }, [])

    return <h1>{slug}</h1>
}