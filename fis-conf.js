// 利用package.json文件定义项目名称和版本
var meta = require('./package.json');
var path = require('path')
var parserVuePlugin = require('fis3-parser-vue-component');

/**环境变量**/
fis.set('name',meta.name)
   .set('version',meta.version);

// 需要构建的文件
fis.set('project.fileType.text', 'vue,map');
fis.set('project.files', ['src/**']);
fis.set('project.ignore', fis.get('project.ignore').concat(['output/**', 'DS_store']));

fis.hook('commonjs', {
    extList: [
        '.js', '.coffee', '.es6', '.jsx', '.vue'
    ],
    umd2commonjs: true,
    ignoreDependencies: []
});
// 禁用components，启用node_modules
fis.unhook('components');
fis.hook('node_modules');
// 所有js文件
fis.match('**.js', {
    isMod: true,
    rExt: 'js',
    useSameNameRequire: true
});
// 模块文件
// fis.match('**.js', {
//     isMod:true,
//     parser: [
//         fis.plugin('babel-6.x', {
//             presets: [['es2015',{"loose":true}], 'react', 'stage-3']
//         }),
//         fis.plugin('translate-es3ify', null, 'append')
//     ],
// });
// 编译vue组件
fis.match('src/**.vue', {
    isMod:true,
    rExt: 'js',
    useSameNameRequire: true,
    parser: [function (content, file, conf) {
        conf.runtimeOnly = true;
        return parserVuePlugin(content, file, conf);
    }
    ]
});
//为node_modules文件添加针对mod.js的转换
fis.match('/src/**.js', {
    isMod:true,
    useSameNameRequire: true,
});
fis.match('/static/**.js', {
    isMod:false,
    useSameNameRequire: true,
});


/**语言编译**/
// fis.match('src/**.vue:js', {
//     isMod: true,
//     rExt: 'js',
//     useSameNameRequire: true,
//     parser: [
//         fis.plugin('babel-6.x', {
//             presets: ['es2015-loose', 'react', 'stage-3']
//         }),
//         fis.plugin('translate-es3ify', null, 'append')
//     ]
// });
// fis.match('src/**.html:js', {
//     isMod: true,
//     rExt: 'js',
//     useSameNameRequire: true,
//     parser: [
//         fis.plugin('babel-6.x', {
//             presets: ['es2015-loose', 'react', 'stage-3']
//         }),
//         fis.plugin('translate-es3ify', null, 'append')
//     ]
// });
fis.match('src/**.vue:jade', {
    parser: [
        fis.plugin('jade', {
            //
        })
    ]
});

fis.match('src/{**.vue:less,**.less}', {
    rExt: 'css',
    parser: [fis.plugin('less-2.x')],
    postprocessor: fis.plugin('autoprefixer', {
        browsers: ['Android >= 2.1', 'iOS >= 4', 'ie >= 8', 'firefox >= 15'],
        cascade: true
    })
});

fis.match('src/{**.vue:scss,**.scss}', {
    rExt: 'css',
    parser: [
        fis.plugin('node-sass', {
            sourceMap: true
            // sourceMapEmbed: true,
        })
    ],
    postprocessor: fis.plugin('autoprefixer', {
        browsers: ['Android >= 2.1', 'iOS >= 4', 'ie >= 8', 'firefox >= 15'],
        cascade: true
    })
});

fis.match('::packager', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'mod',
        useInlineMap: true // 资源映射表内嵌
    }),
    packager: fis.plugin('map'),
    spriter: fis.plugin('csssprites', {
        layout: 'matrix',
        margin: '15'
    })

}).match('**/*.{css,scss}', {
    packTo: '/static/pkg/all.css' //css打成一个包
})

//components下面的所有js资源都是组件化资源
fis.match('/src/(**)', {
    release: '/static/$0'
});
//page里的页面发布到根目录
fis.match("src/(*.html)",{
    release: '/$1',
    useCache : false
});
