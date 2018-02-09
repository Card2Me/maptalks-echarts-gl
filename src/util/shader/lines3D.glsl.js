export default "@export ecgl.lines3D.vertex\r\n\r\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\r\n\r\nattribute vec3 position: POSITION;\r\nattribute vec4 a_Color : COLOR;\r\nvarying vec4 v_Color;\r\n\r\nvoid main()\r\n{\r\n gl_Position = worldViewProjection * vec4(position, 1.0);\r\n v_Color = a_Color;\r\n}\r\n\r\n@end\r\n\r\n@export ecgl.lines3D.fragment\r\n\r\nuniform vec4 color : [1.0, 1.0, 1.0, 1.0];\r\n\r\nvarying vec4 v_Color;\r\n\r\n@import qtek.util.srgb\r\n\r\nvoid main()\r\n{\r\n#ifdef SRGB_DECODE\r\n gl_FragColor = sRGBToLinear(color * v_Color);\r\n#else\r\n gl_FragColor = color * v_Color;\r\n#endif\r\n}\r\n@end\r\n\r\n\r\n\r\n@export ecgl.lines3D.clipNear\r\n\r\nvec4 clipNear(vec4 p1, vec4 p2) {\r\n float n = (p1.w - near) / (p1.w - p2.w);\r\n // PENDING\r\n return vec4(mix(p1.xy, p2.xy, n), -near, near);\r\n}\r\n\r\n@end\r\n\r\n@export ecgl.lines3D.expandLine\r\n#ifdef VERTEX_ANIMATION\r\n vec4 prevProj = worldViewProjection * vec4(mix(prevPositionPrev, positionPrev, percent), 1.0);\r\n vec4 currProj = worldViewProjection * vec4(mix(prevPosition, position, percent), 1.0);\r\n vec4 nextProj = worldViewProjection * vec4(mix(prevPositionNext, positionNext, percent), 1.0);\r\n#else\r\n vec4 prevProj = worldViewProjection * vec4(positionPrev, 1.0);\r\n vec4 currProj = worldViewProjection * vec4(position, 1.0);\r\n vec4 nextProj = worldViewProjection * vec4(positionNext, 1.0);\r\n#endif\r\n\r\n if (currProj.w < 0.0) {\r\n if (nextProj.w > 0.0) {\r\n currProj = clipNear(currProj, nextProj);\r\n }\r\n else if (prevProj.w > 0.0) {\r\n currProj = clipNear(currProj, prevProj);\r\n }\r\n }\r\n\r\n vec2 prevScreen = (prevProj.xy / abs(prevProj.w) + 1.0) * 0.5 * viewport.zw;\r\n vec2 currScreen = (currProj.xy / abs(currProj.w) + 1.0) * 0.5 * viewport.zw;\r\n vec2 nextScreen = (nextProj.xy / abs(nextProj.w) + 1.0) * 0.5 * viewport.zw;\r\n\r\n vec2 dir;\r\n float len = offset;\r\n // Start point\r\n if (position == positionPrev) {\r\n dir = normalize(nextScreen - currScreen);\r\n }\r\n // End point\r\n else if (position == positionNext) {\r\n dir = normalize(currScreen - prevScreen);\r\n }\r\n else {\r\n vec2 dirA = normalize(currScreen - prevScreen);\r\n vec2 dirB = normalize(nextScreen - currScreen);\r\n\r\n vec2 tanget = normalize(dirA + dirB);\r\n\r\n // TODO, simple miterLimit\r\n float miter = 1.0 / max(dot(tanget, dirA), 0.5);\r\n len *= miter;\r\n dir = tanget;\r\n }\r\n\r\n dir = vec2(-dir.y, dir.x) * len;\r\n currScreen += dir;\r\n\r\n currProj.xy = (currScreen / viewport.zw - 0.5) * 2.0 * abs(currProj.w);\r\n@end\r\n\r\n\r\n@export ecgl.meshLines3D.vertex\r\n\r\n// https://mattdesl.svbtle.com/drawing-lines-is-hard\r\nattribute vec3 position: POSITION;\r\nattribute vec3 positionPrev;\r\nattribute vec3 positionNext;\r\nattribute float offset;\r\nattribute vec4 a_Color : COLOR;\r\n\r\n#ifdef VERTEX_ANIMATION\r\nattribute vec3 prevPosition;\r\nattribute vec3 prevPositionPrev;\r\nattribute vec3 prevPositionNext;\r\nuniform float percent : 1.0;\r\n#endif\r\n\r\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\r\nuniform vec4 viewport : VIEWPORT;\r\nuniform float near : NEAR;\r\n\r\nvarying vec4 v_Color;\r\n\r\n@import ecgl.common.wireframe.vertexHeader\r\n\r\n@import ecgl.lines3D.clipNear\r\n\r\nvoid main()\r\n{\r\n @import ecgl.lines3D.expandLine\r\n\r\n gl_Position = currProj;\r\n\r\n v_Color = a_Color;\r\n\r\n @import ecgl.common.wireframe.vertexMain\r\n}\r\n@end\r\n\r\n\r\n@export ecgl.meshLines3D.fragment\r\n\r\nuniform vec4 color : [1.0, 1.0, 1.0, 1.0];\r\n\r\nvarying vec4 v_Color;\r\n\r\n@import ecgl.common.wireframe.fragmentHeader\r\n\r\n@import qtek.util.srgb\r\n\r\nvoid main()\r\n{\r\n#ifdef SRGB_DECODE\r\n gl_FragColor = sRGBToLinear(color * v_Color);\r\n#else\r\n gl_FragColor = color * v_Color;\r\n#endif\r\n\r\n @import ecgl.common.wireframe.fragmentMain\r\n}\r\n\r\n@end";