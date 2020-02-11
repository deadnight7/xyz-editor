/*
 * Copyright (C) 2019-2020 HERE Europe B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * License-Filename: LICENSE
 */
import {editorTests, testUtils, prepare} from 'hereTest';
import {Map} from '@here/xyz-maps-core';
import {Editor} from '@here/xyz-maps-editor';
import dataset from './link_click_spec.json';

describe('link click events', function() {
    const expect = chai.expect;

    let editor;
    let display;
    let preparedData;
    let mapContainer;

    let link;

    before(async function() {
        preparedData = await prepare(dataset);
        display = new Map(document.getElementById('map'), {
            center: {longitude: 76.79443, latitude: 12.94086},
            zoomLevel: 17,
            layers: preparedData.getLayers()
        });
        editor = new Editor(display, {
            layers: preparedData.getLayers()
        });

        await editorTests.waitForEditorReady(editor);
        mapContainer = display.getContainer();
        link = preparedData.getFeature('linkLayer', -189058);
    });

    after(async function() {
        editor.destroy();
        display.destroy();
        await preparedData.clear();
    });


    it('create a link and validate click events', async function() {
        let listener = new testUtils.Listener(editor, ['pointerup']);

        link.select();

        // click on link
        await testUtils.events.click(mapContainer, 250, 200);

        // click on link
        await testUtils.events.click(mapContainer, 260, 200);

        // click on link
        await testUtils.events.click(mapContainer, 270, 200);

        let results = listener.stop();

        expect(results['pointerup']).to.have.lengthOf(2);
    });
});