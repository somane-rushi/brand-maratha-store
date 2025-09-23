import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class MediaAlignPlugin extends Plugin {
    init() {
        const editor = this.editor;

        ['left', 'center', 'right'].forEach(alignment => {
            editor.ui.componentFactory.add(`mediaStyle:align${alignment.charAt(0).toUpperCase() + alignment.slice(1)}`, locale => {
                const view = new ButtonView(locale);

                view.set({
                    label: `Align ${alignment}`,
                    withText: true,
                    tooltip: true
                });

                view.on('execute', () => {
                    const selection = editor.model.document.selection;
                    const selectedElement = selection.getSelectedElement();

                    if (selectedElement && selectedElement.name === 'rawHtml') {
                        editor.model.change(writer => {
                            writer.setAttribute('class', `media-style-align-${alignment}`, selectedElement);
                        });
                    }
                });

                return view;
            });
        });
    }
}
