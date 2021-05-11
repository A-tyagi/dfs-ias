import React from "react";
import { Wrapper, Title, Image, DotWrapper, ContentWrapper, PartnerSymbol } from './Styled';
import Dot from '../../../dots';
import { partnerSymbols } from "../../../../constant";

export const PartnerCard = ({ item, onClick }) => {
   return (
        <Wrapper onClick={() => onClick(item)}>
            {/*<Image src={item.logo} className={"partner-image"}/>*/}
            <PartnerSymbol>{partnerSymbols[item.partnerType]}️</PartnerSymbol>
            <ContentWrapper>
                <Title>{item.name}</Title>
                {/*<DotWrapper>*/}
                {/*    {item.session.map((el, idx) =>*/}
                {/*        <Dot color={PROGRAM_COLOR_KEYS[el.program]} key={idx}/>*/}
                {/*    )}*/}
                {/*</DotWrapper>*/}
            </ContentWrapper>
        </Wrapper>
    )
}