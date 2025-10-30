import backButtonImage from '../../assets/icons/backButtonImageWhite.svg';
import backArrow from '../../assets/icons/backArrow.svg';
import { useNavigate } from 'react-router-dom';
import React from "react";
export const BackButtonWhite = (props) => {
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
                    <img src={backButtonImage} alt={'backButtonImage'} className={'w-[85px] h-[85px]'}/>
                }
                {props.sfondo === 'false' &&
                    <img src={backArrow} alt={'backArrow'} className={'w-5 h-5'}/>
                }
            </button>
        </div>
    );
}