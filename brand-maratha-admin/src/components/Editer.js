
import React from 'react';
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';
import { CAlert, CButton } from '@coreui/react';

const Editor = ({ policy, handlePolicy, viewPolicyHandler, viewPolicy, message, setPolicy }) => {
    const licenseKey = 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NzEwMjcxOTksImp0aSI6ImZjYzExNTVkLWE2NWUtNDU3YS04Yzc2LTEzYzZiNDZiMzFjMCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCJdLCJ2YyI6ImU5OTY3YTBlIn0.cnf8PWSdcKOrwPfY4WDKCG9VCwoNYz2PCH11m_T_kMlkOXgoiTeiRchDrQZx-q2ZuszSZZz63naxSB8d9fKb5A';

    const cloud = useCKEditorCloud({ version: '44.2.0', premium: true });
    if (cloud.status === 'error') return <div>Error!</div>;
    if (cloud.status === 'loading') return <div>Loading...</div>;

    // const {
    //     ClassicEditor,
    //     Essentials, Paragraph, Bold, Italic, Autoformat, Font, Table, Link,
    //     FontSize, Alignment, RemoveFormat, List, ListProperties
    // } = cloud.CKEditor;

    return (
        <>
            {/* <CKEditor
                editor={ClassicEditor}
                data={policy}
                config={{
                    licenseKey: licenseKey,
                    plugins: [Essentials, Paragraph, Bold, Italic, Autoformat, Font, Table,
                        Link, FontSize, Alignment, RemoveFormat, List, ListProperties],
                    toolbar: {
                        items: [
                            'undo', 'redo',
                            '|',
                            'heading',
                            '|',
                            'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                            '|',
                            'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                            '|',
                            'link', 'uploadImage', 'blockQuote', 'codeBlock',
                            '|',
                            'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                        ],
                        shouldNotGroupWhenFull: false
                    }
                }}
                onChange={(event, editor) => setPolicy(editor.getData())}
            /> */}
            <CKEditor
                editor={cloud.CKEditor.ClassicEditor}
                data={policy}
                config={{
                    licenseKey: licenseKey,
                    plugins: [
                        cloud.CKEditor.Essentials,
                        cloud.CKEditor.Paragraph,
                        cloud.CKEditor.Heading,
                        cloud.CKEditor.Bold,
                        cloud.CKEditor.Italic,
                        cloud.CKEditor.RemoveFormat,
                        cloud.CKEditor.Strikethrough,
                        cloud.CKEditor.Autoformat,

                        // Font & Style
                        cloud.CKEditor.Font,
                        cloud.CKEditor.FontSize,
                        cloud.CKEditor.Alignment,

                        // Lists
                        cloud.CKEditor.List,
                        cloud.CKEditor.ListProperties,

                        // Tables
                        cloud.CKEditor.Table,

                        // Links & Embeds
                        cloud.CKEditor.Link,
                        // cloud.CKEditor.MediaEmbed,

                        // Images
                        cloud.CKEditor.Image,
                        cloud.CKEditor.ImageToolbar,
                        cloud.CKEditor.ImageStyle,
                        cloud.CKEditor.ImageInsert,
                        // cloud.CKEditor.ImageUpload,
                        cloud.CKEditor.Base64UploadAdapter,
                        cloud.CKEditor.AutoImage,

                        cloud.CKEditor.ImageUpload,
                        cloud.CKEditor.Alignment,
                    ],
                    toolbar: {
                        items: [
                            // Undo/Redo
                            'undo', 'redo',

                            // Headings
                            '|', 'heading',

                            // Font & Styles
                            '|', 'fontfamily', 'fontsize',
                            '|', 'fontColor', 'fontBackgroundColor',
                            '|', 'bold', 'italic', 'strikethrough', 'removeFormat',
                            '|', 'alignment',

                            // Lists
                            '|', 'bulletedList', 'numberedList', 'todoList',

                            // Indentation
                            '|', 'outdent', 'indent',

                            // Image & Media
                            '|', 'insertImage',
                            // 'uploadImage', 'mediaEmbed',

                            // Links & Blocks
                            '|', 'link', 'blockQuote', 'codeBlock'
                        ],
                        shouldNotGroupWhenFull: false
                    },
                    image: {
                        styles: [
                            'alignLeft',
                            'alignCenter',
                            'alignRight',
                        ],
                        toolbar: [
                            'imageTextAlternative',
                            'imageStyle:alignLeft',
                            'imageStyle:alignCenter',
                            'imageStyle:alignRight',
                        ],
                        style: {
                            definitions: [
                                {
                                    name: 'Align left',
                                    title: 'Align left',
                                    modelElements: ['imageBlock'],
                                    class: 'image-style-align-left'
                                },
                                {
                                    name: 'Align center',
                                    title: 'Align center',
                                    modelElements: ['imageBlock'],
                                    class: 'image-style-align-center'
                                },
                                {
                                    name: 'Align right',
                                    title: 'Align right',
                                    modelElements: ['imageBlock'],
                                    class: 'image-style-align-right'
                                },
                                {
                                    name: 'Full size image',
                                    title: 'Full',
                                    modelElements: ['imageBlock'],
                                    class: 'image-style-full'
                                },
                                {
                                    name: 'Side image',
                                    title: 'Side',
                                    modelElements: ['imageBlock'],
                                    class: 'image-style-side'
                                }
                            ]
                        }

                    },
                }}
                onChange={(event, editor) => {
                    setPolicy(editor.getData());
                }}
            />

            <div className="mt-4 d-flex gap-3">
                <CButton
                    type="button"
                    color={viewPolicy?.id ? "warning" : "primary"}
                    onClick={handlePolicy}
                    disabled={!policy}
                >
                    {viewPolicy?.id ? "Update" : "Save"}
                </CButton>

                <CButton type="button" color="primary" onClick={viewPolicyHandler}>
                    View
                </CButton>
            </div>

        </>
    );
};

export default Editor;

