export default "@export ecgl.lines2D.vertex\r\n\r\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\r\n\r\nattribute vec2 position: POSITION;\r\nattribute vec4 a_Color : COLOR;\r\nvarying vec4 v_Color;\r\n\r\n#ifdef POSITIONTEXTURE_ENABLED\r\nuniform sampler2D positionTexture;\r\n#endif\r\n\r\nvoid main()\r\n{\r\n gl_Position = worldViewProjection * vec4(position, -10.0, 1.0);\r\n\r\n v_Color = a_Color;\r\n}\r\n\r\n@end\r\n\r\n@export ecgl.lines2D.fragment\r\n\r\nuniform vec4 color : [1.0, 1.0, 1.0, 1.0];\r\n\r\nvarying vec4 v_Color;\r\n\r\nvoid main()\r\n{\r\n gl_FragColor = color * v_Color;\r\n}\r\n@end\r\n\r\n\r\n@export ecgl.meshLines2D.vertex\r\n\r\n// https://mattdesl.svbtle.com/drawing-lines-is-hard\r\nattribute vec2 position: POSITION;\r\nattribute vec2 normal;\r\nattribute float offset;\r\nattribute vec4 a_Color : COLOR;\r\n\r\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\r\nuniform vec4 viewport : VIEWPORT;\r\n\r\nvarying vec4 v_Color;\r\nvarying float v_Miter;\r\n\r\nvoid main()\r\n{\r\n vec4 p2 = worldViewProjection * vec4(position + normal, -10.0, 1.0);\r\n gl_Position = worldViewProjection * vec4(position, -10.0, 1.0);\r\n\r\n p2.xy /= p2.w;\r\n gl_Position.xy /= gl_Position.w;\r\n\r\n // Get normal on projection space.\r\n vec2 N = normalize(p2.xy - gl_Position.xy);\r\n gl_Position.xy += N * offset / viewport.zw * 2.0;\r\n\r\n gl_Position.xy *= gl_Position.w;\r\n\r\n v_Color = a_Color;\r\n}\r\n@end\r\n\r\n\r\n@export ecgl.meshLines2D.fragment\r\n\r\nuniform vec4 color : [1.0, 1.0, 1.0, 1.0];\r\n\r\nvarying vec4 v_Color;\r\nvarying float v_Miter;\r\n\r\nvoid main()\r\n{\r\n // TODO Fadeout pixels v_Miter > 1\r\n gl_FragColor = color * v_Color;\r\n}\r\n\r\n@end";