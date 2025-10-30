import backButtonImage from '../../assets/icons/backButtonImage.svg';
import backArrow from '../../assets/icons/backArrow.svg';
import { useNavigate } from 'react-router-dom';
import React from "react";
export const BackButton = (props) => {
    const navigate = useNavigate();
    const goBack = () => {
        try {
            navigate(-1);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="flex flex-wrap">
            <button onClick={goBack} className={''}>
                {props.sfondo === 'true' &&
                    <img src={backButtonImage} alt={'backButtonImage'} className={'w-10 h-10'}/>
                }
                {props.sfondo === 'false' &&
                    <img src={backArrow} alt={'backArrow'} className={'w-5 h-5'}/>
                }
            </button>
        </div>
    );
}