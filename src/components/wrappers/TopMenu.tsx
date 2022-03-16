// -- basic library --
import React from 'react';
import styled from 'styled-components';
import styles from 'utils/styles';
import { Navbar, Nav } from 'react-bootstrap';
import top_logo from 'assets/H.png';

import { Button } from 'react-bootstrap';

// -- redux library --

// -- external components --
const OriginalImg = styled.img`
    max-width: 120px;
    max-height: 20px;
`;

const NavLinkText = styled.div<{
    selected?: boolean;
}>`
    font-weight: ${(params) => (params.selected ? 'bold' : 'normal')};
`;

// -- main component --
interface TopMenuProps {
    onSignOut: () => void;
}

export default class TopMenu extends React.PureComponent<TopMenuProps> {
    // -- render part --
    render() {
        return (
            <div style={{ height: styles.topmenu_height, width: "100%"}}>
                <Navbar collapseOnSelect expand={true} bg="dark" variant="dark" style={{padding: 5}}>
                    <Navbar.Brand href="/homes">
                        <OriginalImg
                            src={top_logo}
                            alt="top_logo"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/homes">
                                Homes
                                </Nav.Link>
                            <Nav.Link href="/receipts"><NavLinkText>Receipts</NavLinkText></Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <Button onClick={this.props.onSignOut} variant="light">sign out</Button>
                </Navbar >
                
            </div>
        )
    }
};