// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import * as React from "react";

import { OpdsPublicationView } from "readium-desktop/common/views/opds";

import { withApi } from "readium-desktop/renderer/components/utils/api";
import { TranslatorProps } from "../utils/translator";

import { dialogActions } from "readium-desktop/common/redux/actions";

import * as styles from "readium-desktop/renderer/assets/styles/dialog.css";

interface Props extends TranslatorProps {
    publication: OpdsPublicationView;
    importOpdsEntry?: (data: any) => any;
    downloadSample?: boolean;
    closeDialog?: any;
}

class SameFileImportConfirm extends React.Component<Props> {
    public constructor(props: any) {
        super(props);

        this.state = {
            menuOpen: false,
        };

        this.addToCatalog = this.addToCatalog.bind(this);
    }

    public render(): React.ReactElement<{}>  {
        const { __, publication } = this.props;
        return (
            <div>
                <p>
                    Il semblerais que vous ayez déjà ajouté cette publication à votre catalogue.
                    <span>{this.props.publication.title}</span>
                </p>
                <p>Êtes vous sûr(e) de vouloir l'ajouter à nouveau ?</p>
                <div>
                    <button onClick={this.addToCatalog}>{__("dialog.yes")}</button>
                    <button className={styles.primary} onClick={this.props.closeDialog}>{__("dialog.no")}</button>
                </div>
            </div>
        );
    }

    private addToCatalog() {
        this.props.importOpdsEntry(
            {
                url: this.props.publication.url,
                base64OpdsPublication: this.props.publication.base64OpdsPublication,
                downloadSample: this.props.downloadSample,
            },
        );
        this.props.closeDialog();
    }
}

const buildRequestData = (props: Props) => {
    return { text: props.publication.title };
};

const mapDispatchToProps = (dispatch: any, props: any) => {
    return {
        closeDialog: () => {
            dispatch(
                dialogActions.close(),
            );
        },
    };
};

export default withApi(
    SameFileImportConfirm,
    {
        operations: [
            {
                moduleId: "publication",
                methodId: "importOpdsEntry",
                callProp: "importOpdsEntry",
            },
            {
                moduleId: "publication",
                methodId: "search",
                resultProp: "searchResult",
                buildRequestData,
                onLoad: true,
            },
        ],
        mapDispatchToProps,
    },
);
